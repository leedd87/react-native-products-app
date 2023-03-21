import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useEffect, useState } from 'react'
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { ProductsStackParams } from '../navigator/ProductsNavigator'

import { Picker } from '@react-native-picker/picker';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';


interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'> { }

export const ProductScreen = ({ navigation, route }: Props) => {


    const { name = '', id = '' } = route.params

    const { isLoading, categories } = useCategories()
    const { loadProductById } = useContext(ProductsContext)

    const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
        _id: '',
        categoriaId: '',
        nombre: name,
        img: '',

    })

    const [selectedLanguage, setSelectedLanguage] = useState();

    useEffect(() => {
        navigation.setOptions({
            title: (name) ? name : 'Nuevo Producto',

        })
    }, [])

    useEffect(() => {

        loadProduct()
    }, [])


    const loadProduct = async () => {
        if (id.length === 0) return;

        const product = await loadProductById(id)
        setFormValue({
            _id: id,
            categoriaId: product.categoria._id,
            img: product.img || '',
            nombre
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.label}>Nombre del producto:</Text>
                <TextInput
                    placeholder='Producto'
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={value => onChange(value, 'nombre')}
                />

                {/*Picker/Selector */}

                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }>
                    {
                        categories.map(c => (

                            <Picker.Item
                                label={c.nombre}
                                value={c._id}
                                key={c._id}
                            />
                        ))
                    }
                </Picker>

                <Text style={styles.label}>Categoria:</Text>

                <Button
                    title='Guardar'
                    onPress={() => { }}
                    color='#5856D6'
                />

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <Button
                        title='Camara'
                        onPress={() => { }}
                        color='#5856D6'
                    />
                    <View style={{ width: 10 }} />
                    <Button
                        title='Galeria'
                        onPress={() => { }}
                        color='#5856D6'
                    />

                </View>

                <Text>{JSON.stringify(form, null, 5)}</Text>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20,
    },
    label: {
        fontSize: 18,
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'green',
        height: 45,
        marginTop: 5,
        marginBottom: 10
    }
})
